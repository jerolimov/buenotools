import { LoaderFunction, useLoaderData, ErrorBoundaryComponent, Link } from "remix";
import type { get as Get } from 'https';

interface Result {
  statusCode?: number;
  headers: Record<string, string | string[] | undefined>;
}

interface LoaderData {
  url: string;
  result?: Result;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const url = new URL(request.url).searchParams.get("url") as string;
  let result: Result | undefined = undefined;
  if (url) {
    result = await new Promise<Result>((resolve, reject) => {
      const get: typeof Get = require('https').get;
      get(url, (res) => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
        });
      }).on('error', (error) => {
        console.error(error);
        reject(error);
      });
    });
  }
  return { url, result };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-center text-3xl font-bold text-gray-600 pb-4">
            <Link to=".">
              HTTPS
            </Link>
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function HttpsHeaders() {
  return (
    <Layout>
      <HttpHeadersForm />
      <HttpHeadersResult />
    </Layout>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <Layout>
      <HttpHeadersForm />
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-600 pb-4">Error!</h2>
        {error.name}<br/>
        {error.message}
      </div>
    </Layout>
  );
}

function HttpHeadersForm() {
  const actionData = useLoaderData<LoaderData>();
  return (
    <form method="get" action="/https/headers">
      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
        {"URL: "}
      </label>
      <input
        id="url"
        type="text"
        name="url"
        defaultValue={actionData?.url || ''}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
      <br/>

      <input
        type="submit"
        value="Fetch"
        className="inline-flex items-center px-3 py-2 border border-transparent font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      />
    </form>
  )
}

function HttpHeadersResult() {
  const loaderData = useLoaderData<LoaderData>();
  if (!loaderData?.result) {
    return null;
  }

  const headers: [string, string][] = [];
  Object.entries(loaderData.result.headers).forEach(([name, valueOrValues]) => {
    if (typeof valueOrValues === 'string') {
      headers.push([name, valueOrValues]);
    } else if (Array.isArray(valueOrValues)) {
      valueOrValues.forEach((value) => headers.push([name, value]));
    }
  });

  return (
    <div className="pt-8">
      <h2 className="text-center text-xl font-bold text-gray-600 py-4">Status code</h2>
      {loaderData.result.statusCode}

      <h2 className="text-center text-xl font-bold text-gray-600 py-4">Hostnames</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
          </tr>
        </thead>
        <tbody>
        {headers.map(([name, value], index) => (
          <tr key={index} className="hover:bg-gray-200">
            <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-600">{name}</td>
            <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-600">{value}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}
