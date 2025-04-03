import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://loved-ant-72.clerk.accounts.dev/.well-known/jwks.json`
            }),
            audience: 'https://automation-tracker.com',
            issuer: 'https://loved-ant-72.clerk.accounts.dev',
        });
    }

    async validate(payload: any) {
        // payload มีข้อมูล user จาก token
        return {
            userId: payload.sub,
            email: payload.email,
            // ข้อมูลอื่นๆ ที่ต้องการ
        };
    }
}