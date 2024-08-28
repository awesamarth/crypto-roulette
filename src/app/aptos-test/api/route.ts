import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
}

const proxy = createProxyMiddleware({
  target: 'https://faucet.testnet.suzuka.movementlabs.xyz',
  changeOrigin: true,
});

export default function handler(req:any, res:any) {
  proxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
}