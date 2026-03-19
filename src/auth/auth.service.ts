import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import staffsData from '../data/staffs.json';

const staffs = staffsData as any[];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = staffs.find(
      (s) => s.email === email && s.password === password,
    );

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Login successful',
      access_token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async logout() {
    return { message: 'Logout successful. Please delete your token.' };
  }
}