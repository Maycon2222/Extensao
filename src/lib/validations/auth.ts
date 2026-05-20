import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email obrigatório")
    .email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter ao menos 2 caracteres")
      .max(80, "Nome muito longo"),
    username: z
      .string()
      .min(3, "Nome de usuário deve ter ao menos 3 caracteres")
      .max(30, "Máximo 30 caracteres")
      .regex(
        /^[a-z0-9_]+$/,
        "Use apenas letras minusculas, números e underscore"
      ),
    email: z
      .string()
      .min(1, "Email obrigatório")
      .email("Email inválido")
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Senha deve ter ao menos 8 caracteres")
      .max(100, "Senha muito longa")
      .regex(/[a-zA-Z]/, "Senha deve ter ao menos uma letra")
      .regex(/\d/, "Senha deve ter ao menos um numero"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message: "Você precisa aceitar os termos",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
