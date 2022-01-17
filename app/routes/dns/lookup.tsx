import { ActionFunction, ErrorBoundaryComponent, useActionData } from "remix";
import { LookupResult, lookup } from "./utils.server";

interface ActionData {
  dnsServer: string;
  hostname: string;
  lookupResult: LookupResult;
}

export const action: ActionFunction = async ({ request }): Promise<ActionData> => {
  const formData = await request.formData();
  console.log("action", formData);
  const dnsServer = formData.get("dnsServer") as string || '4.4.4.4';
  const hostname = formData.get("hostname") as string;
  const lookupResult = await lookup(dnsServer, hostname);
  return { dnsServer, hostname, lookupResult };
};

export default function DnsLookup() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>DNS lookup</h1>
      <Form />
      <Result />
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>DNS lookup</h1>
      <Form />
      <div>
        <h2>Error!</h2>
        {error.name}<br/>
        {error.message}
      </div>
    </div>
  );
}

function Form() {
  const actionData = useActionData<ActionData>();
  return (
    <form method="post" action="/dns/lookup">
      <label>
        {"DNS-Server: "}
        <input
          type="text"
          name="dnsServer"
          defaultValue={actionData?.dnsServer || '4.4.4.4'}
        />
      </label><br/>
      <label>
        {"Hostname: "}
        <input
          type="text"
          name="hostname"
          defaultValue={actionData?.hostname}
        />
      </label>
      <button type="submit">Lookup</button>
    </form>
  )
}

function Result() {
  const actionData = useActionData<ActionData>();
  if (!actionData?.lookupResult) {
    return null;
  }
  return (
    <div>
      <h2>Hostnames</h2>
      <ul>
        {actionData?.lookupResult.hostnames.map((hostname, index) => (
          <li key={index}>{hostname}</li>
        ))}<br/>
      </ul>

      <h2>MX records</h2>
      <table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Exchange</th>
          </tr>
        </thead>
        <tbody>
          {actionData?.lookupResult.mx.map((mxRecord, index) => (
            <tr key={index}>
              <td>{mxRecord.priority}</td>
              <td>{mxRecord.exchange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
