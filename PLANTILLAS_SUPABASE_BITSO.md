# 📧 Plantillas de Supabase - Diseño Bitso Profesional

**Instrucciones:** Copia cada plantilla y pégala en Supabase Dashboard → Authentication → Email Templates

**Colores de marca:**

- Teal: #14b8a6
- Cyan: #0891b2
- Gray: #374151

---

## 1️⃣ CONFIRM SIGNUP (Confirmación de Registro)

**Ubicación en Supabase:** Authentication → Email Templates → "Confirm signup"

### **Subject:**

```
Confirma tu registro en PotentiaMX 🚀
```

### **Body (HTML):**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Confirma tu registro - PotentiaMX</title>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;"
  >
    <!-- Spacer -->
    <div style="height: 40px;"></div>

    <!-- Main Container -->
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="background-color: #f9fafb;"
    >
      <tr>
        <td align="center" style="padding: 0 20px;">
          <!-- Email Card (max-width 600px, centrado) -->
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);"
          >
            <!-- Header con gradiente -->
            <tr>
              <td
                style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 40px 40px 30px 40px; text-align: center;"
              >
                <!-- Logo -->
                <div style="margin-bottom: 16px;">
                  <span
                    style="color: white; font-weight: 700; font-size: 32px; letter-spacing: -0.5px;"
                    >Potentia</span
                  ><span
                    style="color: white; font-weight: 300; font-size: 32px;"
                    >MX</span
                  >
                </div>
                <p
                  style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; font-weight: 500;"
                >
                  ¡Bienvenido!
                </p>
              </td>
            </tr>

            <!-- Content Area -->
            <tr>
              <td
                style="padding: 40px; color: #374151; font-size: 15px; line-height: 1.6;"
              >
                <h2 style="color: #0f766e; margin-top: 0; font-size: 24px;">
                  ¡Hola! 👋
                </h2>

                <p
                  style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 20px;"
                >
                  Gracias por registrarte en <strong>PotentiaMX</strong>. Para
                  completar tu registro y activar tu cuenta, confirma tu email
                  haciendo clic en el botón:
                </p>

                <!-- CTA Button -->
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="margin: 25px 0;"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{ .ConfirmationURL }}"
                        style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
                      >
                        Confirmar mi Email
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #6b7280; margin: 20px 0;">
                  O copia y pega este enlace en tu navegador:
                </p>
                <p
                  style="font-size: 13px; color: #0891b2; word-break: break-all; background: #f0fdfa; padding: 12px; border-radius: 6px; border-left: 3px solid #14b8a6;"
                >
                  {{ .ConfirmationURL }}
                </p>

                <!-- Info Box -->
                <div
                  style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 8px;"
                >
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>⏰ Importante:</strong> Este enlace expira en
                    <strong>24 horas</strong>.
                  </p>
                </div>

                <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
                  Si no creaste esta cuenta, puedes ignorar este email.
                </p>
              </td>
            </tr>

            <!-- Signature -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #374151; margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 20px;"
                >
                  <tr>
                    <td style="padding-right: 20px; vertical-align: top;">
                      <!-- Logo -->
                      <div
                        style="width: 60px; height: 60px; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;"
                      >
                        <span
                          style="color: white; font-weight: 700; font-size: 20px;"
                          >PM</span
                        >
                      </div>
                    </td>
                    <td style="vertical-align: top;">
                      <strong
                        style="display: block; color: #111827; font-size: 16px; margin-bottom: 4px;"
                        >Equipo PotentiaMX</strong
                      >
                      <span
                        style="display: block; color: #6b7280; font-size: 13px; margin-bottom: 8px;"
                        >Onboarding & Soporte</span
                      >

                      <div style="margin-top: 10px;">
                        <a
                          href="mailto:hola@potentiamx.com"
                          style="display: inline-block; color: #14b8a6; text-decoration: none; margin-right: 15px; font-size: 13px;"
                        >
                          📧 hola@potentiamx.com
                        </a>
                      </div>

                      <div style="margin-top: 12px;">
                        <span
                          style="font-weight: 700; color: #111827; font-size: 14px;"
                          >Potentia</span
                        ><span
                          style="font-weight: 300; color: #111827; font-size: 14px;"
                          >MX</span
                        >
                        <span style="color: #d1d5db; margin: 0 8px;">|</span>
                        <a
                          href="https://www.potentiamx.com"
                          style="color: #6b7280; text-decoration: none; font-size: 13px;"
                          >www.potentiamx.com</a
                        >
                      </div>

                      <p
                        style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px; font-style: italic;"
                      >
                        Tours 360° que venden más rápido
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;"
              >
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                  ¿Necesitas ayuda?
                  <a
                    href="mailto:hola@potentiamx.com"
                    style="color: #14b8a6; text-decoration: none;"
                    >Contáctanos</a
                  >
                </p>

                <div style="margin: 15px 0;">
                  <a
                    href="https://www.potentiamx.com"
                    style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 13px;"
                    >Sitio Web</a
                  >
                  <span style="color: #d1d5db;">•</span>
                  <a
                    href="https://www.potentiamx.com/propiedades"
                    style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 13px;"
                    >Marketplace</a
                  >
                  <span style="color: #d1d5db;">•</span>
                  <a
                    href="https://www.potentiamx.com/contacto"
                    style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 13px;"
                    >Contacto</a
                  >
                </div>

                <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                  © 2025 PotentiaMX. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
          <!-- End Email Card -->
        </td>
      </tr>
    </table>

    <!-- Spacer -->
    <div style="height: 40px;"></div>
  </body>
</html>
```

---

## 2️⃣ RESET PASSWORD (Recuperar Contraseña)

**Ubicación en Supabase:** Authentication → Email Templates → "Reset password"

### **Subject:**

```
Recupera tu contraseña de PotentiaMX 🔑
```

### **Body (HTML):**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Recuperar contraseña - PotentiaMX</title>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;"
  >
    <!-- Spacer -->
    <div style="height: 40px;"></div>

    <!-- Main Container -->
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="background-color: #f9fafb;"
    >
      <tr>
        <td align="center" style="padding: 0 20px;">
          <!-- Email Card -->
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);"
          >
            <!-- Header -->
            <tr>
              <td
                style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 40px 40px 30px 40px; text-align: center;"
              >
                <div style="margin-bottom: 16px;">
                  <span
                    style="color: white; font-weight: 700; font-size: 32px; letter-spacing: -0.5px;"
                    >Potentia</span
                  ><span
                    style="color: white; font-weight: 300; font-size: 32px;"
                    >MX</span
                  >
                </div>
                <p
                  style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; font-weight: 500;"
                >
                  Recuperar Contraseña
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td
                style="padding: 40px; color: #374151; font-size: 15px; line-height: 1.6;"
              >
                <h2 style="color: #0f766e; margin-top: 0; font-size: 24px;">
                  Hola 👋
                </h2>

                <p
                  style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 20px;"
                >
                  Recibimos una solicitud para restablecer la contraseña de tu
                  cuenta de <strong>PotentiaMX</strong>.
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Haz clic en el botón para crear una nueva contraseña:
                </p>

                <!-- CTA Button -->
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="margin: 25px 0;"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{ .ConfirmationURL }}"
                        style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
                      >
                        Restablecer Contraseña
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #6b7280; margin: 20px 0;">
                  O copia y pega este enlace en tu navegador:
                </p>
                <p
                  style="font-size: 13px; color: #0891b2; word-break: break-all; background: #f0fdfa; padding: 12px; border-radius: 6px; border-left: 3px solid #14b8a6;"
                >
                  {{ .ConfirmationURL }}
                </p>

                <!-- Warning Box -->
                <div
                  style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 8px;"
                >
                  <p style="margin: 0; color: #991b1b; font-size: 14px;">
                    <strong>⏰ Importante:</strong> Este enlace expira en
                    <strong>1 hora</strong>.
                  </p>
                </div>

                <div
                  style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin: 25px 0; border-radius: 8px;"
                >
                  <p style="margin: 0; color: #0f766e; font-size: 14px;">
                    <strong>🔒 Seguridad:</strong> Si no solicitaste este
                    cambio, ignora este email y tu contraseña permanecerá sin
                    cambios.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Signature -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #374151; margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 20px;"
                >
                  <tr>
                    <td style="padding-right: 20px; vertical-align: top;">
                      <div
                        style="width: 60px; height: 60px; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;"
                      >
                        <span
                          style="color: white; font-weight: 700; font-size: 20px;"
                          >PM</span
                        >
                      </div>
                    </td>
                    <td style="vertical-align: top;">
                      <strong
                        style="display: block; color: #111827; font-size: 16px; margin-bottom: 4px;"
                        >Equipo PotentiaMX</strong
                      >
                      <span
                        style="display: block; color: #6b7280; font-size: 13px; margin-bottom: 8px;"
                        >Seguridad & Soporte</span
                      >

                      <div style="margin-top: 10px;">
                        <a
                          href="mailto:hola@potentiamx.com"
                          style="display: inline-block; color: #14b8a6; text-decoration: none; margin-right: 15px; font-size: 13px;"
                        >
                          📧 hola@potentiamx.com
                        </a>
                      </div>

                      <div style="margin-top: 12px;">
                        <span
                          style="font-weight: 700; color: #111827; font-size: 14px;"
                          >Potentia</span
                        ><span
                          style="font-weight: 300; color: #111827; font-size: 14px;"
                          >MX</span
                        >
                        <span style="color: #d1d5db; margin: 0 8px;">|</span>
                        <a
                          href="https://www.potentiamx.com"
                          style="color: #6b7280; text-decoration: none; font-size: 13px;"
                          >www.potentiamx.com</a
                        >
                      </div>

                      <p
                        style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px; font-style: italic;"
                      >
                        Tours 360° que venden más rápido
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;"
              >
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                  ¿Necesitas ayuda?
                  <a
                    href="mailto:hola@potentiamx.com"
                    style="color: #14b8a6; text-decoration: none;"
                    >Contáctanos</a
                  >
                </p>

                <div style="margin: 15px 0;">
                  <a
                    href="https://www.potentiamx.com"
                    style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 13px;"
                    >Sitio Web</a
                  >
                  <span style="color: #d1d5db;">•</span>
                  <a
                    href="https://www.potentiamx.com/propiedades"
                    style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 13px;"
                    >Marketplace</a
                  >
                  <span style="color: #d1d5db;">•</span>
                  <a
                    href="https://www.potentiamx.com/contacto"
                    style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 13px;"
                    >Contacto</a
                  >
                </div>

                <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                  © 2025 PotentiaMX. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="height: 40px;"></div>
  </body>
</html>
```

---

## 3️⃣ MAGIC LINK (Inicio de Sesión sin Contraseña)

**Ubicación en Supabase:** Authentication → Email Templates → "Magic Link"

### **Subject:**

```
Tu enlace de acceso a PotentiaMX 🔐
```

### **Body (HTML):**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Magic Link - PotentiaMX</title>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
  >
    <div style="height: 40px;"></div>

    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="background-color: #f9fafb;"
    >
      <tr>
        <td align="center" style="padding: 0 20px;">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);"
          >
            <tr>
              <td
                style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 40px; text-align: center;"
              >
                <div style="margin-bottom: 16px;">
                  <span style="color: white; font-weight: 700; font-size: 32px;"
                    >Potentia</span
                  ><span
                    style="color: white; font-weight: 300; font-size: 32px;"
                    >MX</span
                  >
                </div>
                <p
                  style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; font-weight: 500;"
                >
                  Inicio de Sesión
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 40px;">
                <h2 style="color: #0f766e; margin-top: 0; font-size: 24px;">
                  ¡Hola! 👋
                </h2>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Haz clic en el botón para iniciar sesión en tu cuenta de
                  <strong>PotentiaMX</strong>:
                </p>

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="margin: 25px 0;"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{ .ConfirmationURL }}"
                        style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
                      >
                        Iniciar Sesión
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #6b7280;">
                  O copia este enlace:
                </p>
                <p
                  style="font-size: 13px; color: #0891b2; word-break: break-all; background: #f0fdfa; padding: 12px; border-radius: 6px; border-left: 3px solid #14b8a6;"
                >
                  {{ .ConfirmationURL }}
                </p>

                <div
                  style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 8px;"
                >
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>⏰ Este enlace expira en 1 hora.</strong>
                  </p>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                  Si no solicitaste este email, puedes ignorarlo.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;"
              >
                <p style="margin: 0; color: #6b7280; font-size: 13px;">
                  ¿Necesitas ayuda?
                  <a
                    href="mailto:hola@potentiamx.com"
                    style="color: #14b8a6; text-decoration: none;"
                    >Contáctanos</a
                  >
                </p>
                <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                  © 2025 PotentiaMX. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="height: 40px;"></div>
  </body>
</html>
```

---

## 4️⃣ CHANGE EMAIL (Cambiar Email)

**Ubicación en Supabase:** Authentication → Email Templates → "Change Email Address"

### **Subject:**

```
Confirma tu nuevo email en PotentiaMX ✉️
```

### **Body (HTML):**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cambio de email - PotentiaMX</title>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
  >
    <div style="height: 40px;"></div>

    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="background-color: #f9fafb;"
    >
      <tr>
        <td align="center" style="padding: 0 20px;">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);"
          >
            <tr>
              <td
                style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 40px; text-align: center;"
              >
                <div style="margin-bottom: 16px;">
                  <span style="color: white; font-weight: 700; font-size: 32px;"
                    >Potentia</span
                  ><span
                    style="color: white; font-weight: 300; font-size: 32px;"
                    >MX</span
                  >
                </div>
                <p
                  style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; font-weight: 500;"
                >
                  Cambio de Email
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 40px;">
                <h2 style="color: #0f766e; margin-top: 0; font-size: 24px;">
                  Confirma tu nuevo email
                </h2>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Recibimos una solicitud para cambiar el email de tu cuenta de
                  <strong>PotentiaMX</strong>.
                </p>

                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Haz clic en el botón para confirmar tu nuevo email:
                </p>

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="margin: 25px 0;"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="{{ .ConfirmationURL }}"
                        style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
                      >
                        Confirmar Nuevo Email
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #6b7280;">
                  O copia este enlace:
                </p>
                <p
                  style="font-size: 13px; color: #0891b2; word-break: break-all; background: #f0fdfa; padding: 12px; border-radius: 6px; border-left: 3px solid #14b8a6;"
                >
                  {{ .ConfirmationURL }}
                </p>

                <div
                  style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin: 25px 0; border-radius: 8px;"
                >
                  <p style="margin: 0; color: #0f766e; font-size: 14px;">
                    Si no solicitaste este cambio,
                    <strong>ignora este email</strong> y tu email actual
                    permanecerá sin cambios.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td
                style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;"
              >
                <p style="margin: 0; color: #6b7280; font-size: 13px;">
                  ¿Necesitas ayuda?
                  <a
                    href="mailto:hola@potentiamx.com"
                    style="color: #14b8a6; text-decoration: none;"
                    >Contáctanos</a
                  >
                </p>
                <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                  © 2025 PotentiaMX. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="height: 40px;"></div>
  </body>
</html>
```

---

## 📋 INSTRUCCIONES PARA ACTUALIZAR EN SUPABASE

### **Paso 1: Ir a Supabase Dashboard**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: `tuhojmupstisctgaepsc`
3. En el menú lateral, ve a **Authentication**
4. Click en **Email Templates**

### **Paso 2: Actualizar cada plantilla**

Para cada una de las 4 plantillas:

1. **Confirm signup**
   - Pega el Subject en el campo "Subject"
   - Pega el HTML en el campo "Message (Body)"
   - Click "Save"

2. **Reset password**
   - Pega el Subject en el campo "Subject"
   - Pega el HTML en el campo "Message (Body)"
   - Click "Save"

3. **Magic Link**
   - Pega el Subject
   - Pega el HTML
   - Click "Save"

4. **Change Email Address**
   - Pega el Subject
   - Pega el HTML
   - Click "Save"

### **Paso 3: Probar**

1. Cierra sesión de tu app
2. Ve a `/signup` y registra un nuevo usuario de prueba
3. Deberías recibir email de confirmación con el **nuevo diseño Bitso**

---

## ✅ RESULTADO FINAL

Después de actualizar las plantillas, todos tus emails tendrán:

- ✅ Diseño centrado 600px estilo Bitso
- ✅ Gradiente teal → cyan (colores de marca)
- ✅ Logo "PotentiaMX" con pesos correctos
- ✅ Firma profesional con logo PM
- ✅ Footer con links y copyright
- ✅ Responsive y compatible con todos los clientes de email

**Emails con nuevo diseño:**

- ✅ Confirmación de registro (Supabase)
- ✅ Reset password (Supabase)
- ✅ Magic link (Supabase)
- ✅ Change email (Supabase)
- ✅ Bienvenida (App)
- ✅ Leads (App)
- ✅ Analytics (App)

---

**Documento creado:** 21 de Octubre, 2025
**Próximo paso:** Actualizar plantillas en Supabase Dashboard
