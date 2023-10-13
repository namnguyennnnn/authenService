import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export class ReverseProxyAuthMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: 'http://auth:3000/',
    pathRewrite: {
      '/auth': '/',
    },
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      // console.log(proxyReq);
    },
  });

  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}
