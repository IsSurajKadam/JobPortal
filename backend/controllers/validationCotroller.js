import { promises as dns } from 'dns';

export const validateEmailDomain = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ valid: false, message: 'Invalid email format' });
    }

    const domain = email.split('@')[1];

    await dns.resolveMx(domain);
    return res.json({ valid: true, domain });
  } catch (err) {

    return res.json({ valid: false, message: 'Domain does not exist or cannot receive mail' });
  }
};
