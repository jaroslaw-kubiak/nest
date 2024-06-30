import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// scrypt jest funkcją asynchroniczną, więc używamy promisify,
// aby przekształcić ją w funkcję zwracającą obietnicę.
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // Hash the password
    // generate salt - 16 chars
    const salt = randomBytes(8).toString('hex');

    // hash salt and password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join salt and hashed password
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Bad password');
    }
    console.log(`###################### user singin ######################`);
    console.log(user);
    return user;
  }
}
