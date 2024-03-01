import { useMutation, useQuery } from '@tanstack/react-query';
import './App.css';
import { z } from 'zod';
import { useState } from 'react';

const InviteSchema = z.object({
  // ...
});

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '2em' }}>
      <MutationStyle />
      <QueryStyle />
    </div>
  );
}

function MutationStyle() {
  const mutation = useMutation({
    async mutationFn() {
      const code = await navigator.clipboard.readText();
      try {
        await new Promise((r) => setTimeout(r, 1000));
        const response = await fetch(`https://api.test/invite/${code}`);
        if (!response.ok) {
          throw new Error('Invalid invite code');
        }
        return InviteSchema.parse(await response.json());
      } catch {
        throw new Error("Couldn't validate invite code");
      }
    },
  });

  return (
    <div>
      <h1>As Mutation:</h1>
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.status === 'pending'}
      >
        {mutation.status === 'pending' ? 'Loading...' : 'Get Invite'}
      </button>
      {mutation.status === 'error' && (
        <p style={{ color: 'red' }}>{String(mutation.error)}</p>
      )}
    </div>
  );
}

function QueryStyle() {
  const [code, setCode] = useState('');
  const query = useQuery({
    queryKey: ['invite', code],
    async queryFn() {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        const response = await fetch(`https://api.test/invite/${code}`);
        if (!response.ok) {
          throw new Error('Invalid invite code');
        }
        return InviteSchema.parse(await response.json());
      } catch {
        throw new Error("Couldn't validate invite code");
      }
    },
    enabled: !!code,
    retry: false,
  });

  return (
    <div>
      <h1>As Mutation:</h1>
      <button
        onClick={async () => {
          setCode(await navigator.clipboard.readText());
        }}
        disabled={query.fetchStatus === 'fetching'}
      >
        {query.fetchStatus === 'fetching' ? 'Loading...' : 'Get Invite'}
      </button>
      {query.status === 'error' && (
        <p style={{ color: 'red' }}>{String(query.error)}</p>
      )}
    </div>
  );
}

export default App;
