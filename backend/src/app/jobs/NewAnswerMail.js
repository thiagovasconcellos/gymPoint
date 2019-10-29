import Mail from '../../lib/Mail';

class NewAnswerMail {
  get key() {
    return 'NewAnswerMail';
  }

  async handle({ data }) {
    const { student, question, answer } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Nova resposta para seu questionamento',
      template: 'newAnswer',
      context: {
        name: student.name,
        question: question.question,
        answer,
      },
    });
  }
}

export default new NewAnswerMail();
