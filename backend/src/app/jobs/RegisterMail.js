import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegisterMail {
  get key() {
    return 'RegisterMail';
  }

  async handle({ data }) {
    const { student, membership, start_date, end_date, price } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Nova matricula',
      template: 'registration',
      context: {
        name: student.name,
        start_date: format(
          parseISO(start_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(parseISO(end_date), "'dia' dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        duration: membership.duration,
        price,
      },
    });
  }
}

export default new RegisterMail();
