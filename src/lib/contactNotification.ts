export function notificationEmailText(data: {
  name: string;
  email: string;
  sessionType: string;
  message: string;
}): string {
  return `Nom : ${data.name}\nCourriel : ${data.email}\nType de séance : ${data.sessionType}\n\nMessage :\n${data.message}`;
}
