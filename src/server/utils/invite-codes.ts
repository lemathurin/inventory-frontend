const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateInviteCode = (): string => {
  let code = "";

  for (let index = 0; index < 8; index += 1) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    if (index === 3) {
      code += "-";
    }
  }

  return code;
};

export const validateInviteCode = (code: string): boolean =>
  /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
