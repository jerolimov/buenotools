import { useRef, useState } from "react";
import { Link } from "remix";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-center text-3xl font-bold text-gray-600 pb-4">
            <Link to="." reloadDocument replace>JSON format</Link>
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function JSONFormat() {
  return (
    <Layout>
      <JSONForm />
    </Layout>
  );
}

function JSONForm() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);
  const format = () => {
    try {
      if (ref.current) {
        ref.current.value = JSON.stringify(JSON.parse(ref.current.value), null, 2);
      }
      setError(null);
    } catch (error) {
      setError(`${error}`);
    }
  };
  return (
    <div>
      <label
        htmlFor="json"
        className="block text-sm font-medium text-gray-700"
      >
        {"JSON: "}
      </label>
      <textarea
        id="json"
        ref={ref}
        rows={10}
        autoFocus
        autoCorrect="false"
        className="font-mono shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
      <br />

      <button
        type="button"
        onClick={format}
        className="inline-flex items-center px-3 py-2 border border-transparent font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Format
      </button>

      {error ? (
        <div className="mt-8 text-sm text-red-600">{error}</div>
      ) : null}
    </div>
  );
}
