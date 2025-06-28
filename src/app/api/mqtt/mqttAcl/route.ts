// src/app/api/mqtt/mqttAcl/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

type JwtPayload = {
  userId: number;
  clientid: string;
  topic: string;
  type: 'subscriber' | 'publisher';
  iat: number;
  exp: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('✅ EMQX hit this route!');
    console.log('📦 Request Body:', body);

    const { username, clientid, topic, action } = body;

    const token = username?.replace('Bearer ', '');
    if (!token) {
      const res = { result: 'deny', reason: 'Token missing' };
      console.log('❌ Response to EMQX:', res);
      return NextResponse.json(res, { status: 200 }); // ✅ always status 200
    }

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Validasi clientid
    if (payload.clientid !== clientid) {
      const res = { result: 'deny', reason: 'ClientID mismatch' };
      console.log('❌ Response to EMQX:', res);
      return NextResponse.json(res, { status: 200 });
    }

    // Validasi action sesuai type
    if (payload.type === 'publisher' && action === 'subscribe') {
      const res = { result: 'deny', reason: 'Publisher tidak boleh subscribe' };
      console.log('❌ Response to EMQX:', res);
      return NextResponse.json(res, { status: 200 });
    }

    if (payload.type === 'subscriber' && action === 'publish') {
      const res = { result: 'deny', reason: 'Subscriber tidak boleh publish' };
      console.log('❌ Response to EMQX:', res);
      return NextResponse.json(res, { status: 200 });
    }

    // Validasi topic
    if (payload.topic !== topic) {
      const res = { result: 'deny', reason: 'Topik tidak sesuai' };
      console.log('❌ Response to EMQX:', res);
      return NextResponse.json(res, { status: 200 });
    }

    // Bangun aturan sesuai role
    const rules = [];

    if (payload.type === 'subscriber') {
      rules.push({ action: 'subscribe', permission: 'allow', topic: payload.topic });
      rules.push({ action: 'publish', permission: 'deny', topic: '#' });
    } else if (payload.type === 'publisher') {
      rules.push({ action: 'publish', permission: 'allow', topic: payload.topic });
      rules.push({ action: 'subscribe', permission: 'deny', topic: '#' });
    }

    const res = { result: 'allow', rules };
    console.log('✅ Response to EMQX:', res);
    return NextResponse.json(res, { status: 200 });

  } catch (err: any) {
    const res = { result: 'deny', reason: 'Invalid or expired token' };
    console.error('❌ JWT Error:', err.message);
    console.log('❌ Response to EMQX:', res);
    return NextResponse.json(res, { status: 200 }); // ✅ tetap 200
  }
}
