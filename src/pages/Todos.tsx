import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Todos() {
  const [todos, setTodos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTodos() {
      const { data: todos, error } = await supabase.from('todos').select('*');

      if (error) {
        setError(error.message);
      } else if (todos) {
        setTodos(todos);
      }
    }

    getTodos();
  }, []);

  return (
    <div className="p-10 mt-10">
      <h1 className="text-2xl font-bold mb-4">Todos List (Database Test)</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-4">
          <p className="font-bold">Error fetching data:</p>
          <p>{error}</p>
          <p className="text-sm mt-2 opacity-80">Make sure you have created a "todos" table in your Supabase project and enabled read access (RLS)!</p>
        </div>
      )}

      {todos.length === 0 && !error && (
        <p className="text-muted-foreground">No todos found or loading...</p>
      )}

      <ul className="list-disc pl-5">
        {todos.map((todo) => (
          <li key={todo.id}>{todo.name || JSON.stringify(todo)}</li>
        ))}
      </ul>
    </div>
  );
}
