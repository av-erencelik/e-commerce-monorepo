import { Resend } from 'resend';
import config from '../config/config';

const resend = new Resend(config.resend.apiKey);

export default resend;
