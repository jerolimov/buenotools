import { LoaderFunction, useLoaderData, ErrorBoundaryComponent, Link } from "remix";
import { LookupResult, lookup } from "./utils.server";

interface LoaderData {
  dnsServer: string;
  hostname: string;
  lookupResult?: LookupResult;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const url = new URL(request.url);
  const dnsServer = url.searchParams.get("dnsServer") as string || '8.8.8.8';
  const hostname = url.searchParams.get("hostname") as string || '';
  const lookupResult = hostname ? (await lookup(dnsServer, hostname)) : undefined;
  return { dnsServer, hostname, lookupResult };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-center text-3xl font-bold text-gray-600 pb-4">
            <Link to=".">
              DNS lookup
            </Link>
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DnsLookup() {
  return (
    <Layout>
      <DnsLookupForm />
      <DnsLookupResult />
    </Layout>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <Layout>
      <DnsLookupForm />
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-600 pb-4">Error!</h2>
        {error.name}<br/>
        {error.message}
      </div>
    </Layout>
  );
}

function DnsLookupForm() {
  const actionData = useLoaderData<LoaderData>();
  return (
    <form method="get" action="/dns/lookup">
      <label htmlFor="dnsServer" className="block text-sm font-medium text-gray-700">
        {"DNS-Server: "}
      </label>
      <input
        id="dnsServer"
        type="text"
        name="dnsServer"
        defaultValue={actionData?.dnsServer || '4.4.4.4'}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
      <br/>

      <label htmlFor="hostname" className="block text-sm font-medium text-gray-700">
        {"Hostname: "}
      </label>
      <input
        id="hostname"
        type="text"
        name="hostname"
        defaultValue={actionData?.hostname}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
      <br/>

      <input
        type="submit"
        value="Lookup"
        className="inline-flex items-center px-3 py-2 border border-transparent font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      />
    </form>
  )
}

function DnsLookupResult() {
  const loaderData = useLoaderData<LoaderData>();
  if (!loaderData?.lookupResult) {
    return null;
  }
  return (
    <div className="pt-8">
      <h2 className="text-center text-xl font-bold text-gray-600 py-4">Hostnames</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange</th>
          </tr>
        </thead>
        <tbody>
        {loaderData?.lookupResult.hostnames.map((hostname, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">A</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{hostname}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <h2 className="text-center text-xl font-bold text-gray-600 py-4">MX records</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange</th>
          </tr>
        </thead>
        <tbody>
          {loaderData?.lookupResult.mx.map((mxRecord, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mxRecord.priority}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mxRecord.exchange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
