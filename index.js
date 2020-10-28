const http = require('http')
const Eureka = require('eureka-js-client').Eureka;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const hostname = "vm30101.svl.ibm.com";
const port = 8888;
 
// example configuration
const client = new Eureka({
  // application instance information
  instance: {
    instanceId: `${hostname}:${port}`,
    app: 'apicatalog',
    hostName: hostname,
    ipAddr: '9.30.243.196',
    status: "UP",
    port: {
      '$': port,
      '@enabled': true,
    },
    securePort: {
      '$': port,
      '@enabled': false,
    },
    vipAddress: 'apicatalog',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    metadata: {
      "apiml.service.description": "API Catalog service to display service details and API documentation for discovered API services.",
      "apiml.routes.api__v1.gatewayUrl": "api/v1",
      "apiml.catalog.tile.version": "1.0.0",
      "management.port": `${port}`,
      "apiml.catalog.tile.description": "The API Mediation Layer for z/OS internal API services. The API Mediation Layer provides a single point of access to mainframe REST APIs and offers enterprise cloud-like features such as high-availability, scalability, dynamic API discovery, and documentation.",
      "apiml.service.title": "API Catalog",
      "apiml.routes.ui__v1.gatewayUrl": "ui/v1",
      "apiml.apiInfo.0.apiId": "org.zowe.apicatalog",
      "apiml.apiInfo.0.gatewayUrl": "api/v1",
      "apiml.catalog.tile.id": "apimediationlayer",
      "apiml.routes.ui__v1.serviceUrl": "/apicatalog",
      "apiml.routes.api__v1.serviceUrl": "/apicatalog",
      "apiml.apiInfo.0.version": "1.0.0",
      "apiml.apiInfo.0.swaggerUrl": "https://vm30101.svl.ibm.com:7552/apicatalog/v2/api-docs",
      "apiml.catalog.tile.title": "API Mediation Layer API",
    }
  },
  leaseInfo: {
    durationInSecs: 90, // 3 * heartbeatInterval
    renewalIntervalInSecs: 30 // heartbeatInterval
  },
  eureka: {
    servicePath: '/eureka/apps/',
    // eureka server host / port
    host: hostname,
    port: 7553,
    ssl: true,
  },
  requestMiddleware: (requestOpts, done) => {
    requestOpts.auth = {
      user: 'eureka',
      password: 'password'
    };
    done(requestOpts);
  },
});
client.logger.level('debug');


const server = http.createServer((req, res) => {
  console.log('>>>>>', req.headers);
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  client.start();
})

