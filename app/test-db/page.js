import { createClient } from '@/lib/supabaseClient';

export default async function TestDB() {
  const testId = '35032fac-e29b-4c7a-a20f-44a89896bb66';
  const supabase = createClient();

  // Test 1: Obtener TODOS los terrenos
  const { data: allTerrenos, error: allError } = await supabase
    .from('terrenos')
    .select('id, title, image_urls');

  // Test 2: Buscar por ID específico
  const { data: specificTerreno, error: specificError } = await supabase
    .from('terrenos')
    .select('*')
    .eq('id', testId);

  // Test 2.5: Buscar terreno "charlie"
  const { data: charlieTerreno, error: charlieError } = await supabase
    .from('terrenos')
    .select('*')
    .ilike('title', '%charlie%');

  // Test 3: Contar terrenos
  const { count, error: countError } = await supabase
    .from('terrenos')
    .select('*', { count: 'exact', head: true });

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'monospace',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: '2rem' }}>🔍 Test de Base de Datos</h1>

      {/* Test 1 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
        }}
      >
        <h2>📊 Test 1: Todos los terrenos</h2>
        {allError ? (
          <pre style={{ color: '#ff6b6b' }}>
            ❌ Error: {JSON.stringify(allError, null, 2)}
          </pre>
        ) : (
          <>
            <p>✅ Total encontrados: {allTerrenos?.length || 0}</p>
            <pre
              style={{
                backgroundColor: '#1a1a1a',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(allTerrenos, null, 2)}
            </pre>
          </>
        )}
      </div>

      {/* Test 2 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
        }}
      >
        <h2>🎯 Test 2: Buscar ID específico</h2>
        <p>
          Buscando: <code>{testId}</code>
        </p>
        {specificError ? (
          <pre style={{ color: '#ff6b6b' }}>
            ❌ Error: {JSON.stringify(specificError, null, 2)}
          </pre>
        ) : (
          <>
            <p>✅ Resultados: {specificTerreno?.length || 0}</p>
            <pre
              style={{
                backgroundColor: '#1a1a1a',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(specificTerreno, null, 2)}
            </pre>
          </>
        )}
      </div>

      {/* Test 2.5: Buscar Charlie */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
        }}
      >
        <h2>🔍 Test 2.5: Buscar terreno &quot;Charlie&quot;</h2>
        <p>Buscando terrenos que contengan &quot;charlie&quot; en el título</p>
        {charlieError ? (
          <pre style={{ color: '#ff6b6b' }}>
            ❌ Error: {JSON.stringify(charlieError, null, 2)}
          </pre>
        ) : (
          <>
            <p>✅ Resultados: {charlieTerreno?.length || 0}</p>
            {charlieTerreno && charlieTerreno.length > 0 && (
              <div>
                <p>
                  <strong>ID para probar:</strong>{' '}
                  <code>{charlieTerreno[0].id}</code>
                </p>
                <p>
                  <strong>URL para probar:</strong>{' '}
                  <a
                    href={`/terreno/${charlieTerreno[0].id}`}
                    target="_blank"
                    style={{ color: '#4ade80' }}
                  >
                    /terreno/{charlieTerreno[0].id}
                  </a>
                </p>
              </div>
            )}
            <pre
              style={{
                backgroundColor: '#1a1a1a',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(charlieTerreno, null, 2)}
            </pre>
          </>
        )}
      </div>

      {/* Test 3 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
        }}
      >
        <h2>🔢 Test 3: Contar terrenos</h2>
        {countError ? (
          <pre style={{ color: '#ff6b6b' }}>
            ❌ Error: {JSON.stringify(countError, null, 2)}
          </pre>
        ) : (
          <p>✅ Total en base de datos: {count}</p>
        )}
      </div>

      {/* Info de conexión */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
        }}
      >
        <h2>🔗 Info de Conexión</h2>
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No configurada'}</p>
        <p>
          Key:{' '}
          {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? '✅ Configurada'
            : '❌ No configurada'}
        </p>
      </div>
    </div>
  );
}
