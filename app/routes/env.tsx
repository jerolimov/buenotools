import { Link, LoaderFunction, useLoaderData } from "remix";

type EnvVar = [string, string | undefined];
type Section = {
  title: string;
  vars: EnvVar[];
};

interface LoaderData {
  sections: Section[];
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const isNodeRelated = (name: string) =>
      name === 'NODE' ||
      name === 'NODE_ENV' ||
      name.startsWith('npm_');

  const vars: EnvVar[] = Object.entries(process.env);
  const sections: Section[] = [];
  sections.push({
    title: 'General variables',
    vars: vars.filter(([name]) => !isNodeRelated(name)),
  });
  sections.push({
    title: 'Node variables',
    vars: vars.filter(([name]) => isNodeRelated(name)),
  });
  return { sections };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-center text-3xl font-bold text-gray-600 pb-4">
            <Link to=".">Environment variables</Link>
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function EnvironmentVariables() {
  const loaderData = useLoaderData<LoaderData>();
  return (
    <Layout>
      {
        loaderData.sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-center text-xl font-bold text-gray-600 py-4">{section.title}</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {section.vars.map(([name, value], index) => (
                  <tr key={index}>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                    >{name}</td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                      style={{ lineBreak: 'anywhere', whiteSpace: 'break-spaces' }}
                    >{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      }
    </Layout>
  );
}