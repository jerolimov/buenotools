import dns from 'dns';

export interface LookupResult {
  hostnames: string[];
  mx: dns.MxRecord[];
}

export async function lookup(dnsServer: string, hostname: string): Promise<LookupResult> {
  console.log('lookup', dnsServer, hostname);
  const resolver = new dns.promises.Resolver();
  if (dnsServer) {
    resolver.setServers([dnsServer]);
  }
  const hostnames = await resolver.resolve(hostname);
  console.log('lookup hostnames', hostnames);
  const mx = await resolver.resolveMx(hostname);
  console.log('lookup mx', mx);
  return {
    hostnames,
    mx,
  };
}
