import { Link, useLocation, useNavigate } from "remix";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-center text-3xl font-bold text-gray-600 pb-4">
            <Link to=".">
              Link test
            </Link>
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LinkTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const url = new URLSearchParams(location.search).get('url') || '';
  return (
    <Layout>
      <form method="get" action="/link/test">
      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
        {"URL: "}
      </label>
      <input
        id="url"
        type="text"
        name="url"
        value={url}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        onChange={(event) => {
          navigate({
            search: '?url=' + encodeURIComponent(event.target.value)
          }, {
            replace: true,
          });
        }}
      />
      <br/>

      <div>
        Link:<br/>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >{url}</a>
      </div>
      <br/>

      <input
        type="submit"
        value="Lookup"
        className="inline-flex items-center px-3 py-2 border border-transparent font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      />
    </form>
    </Layout>
  );
}
