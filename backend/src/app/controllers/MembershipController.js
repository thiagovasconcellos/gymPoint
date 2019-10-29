import * as Yup from 'yup';
import Membership from '../models/Membership';

class MembershipController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    const membershipExists = await Membership.findOne({
      where: { title: req.body.title },
    });

    if (membershipExists) {
      return res.status(400).json({ error: 'Membership already exists' });
    }

    const { title } = req.body;
    if (title.length > 150) {
      return res
        .status(400)
        .json({ error: 'Title max size is set to 150 characters' });
    }

    const { duration } = req.body;
    if (duration > 12) {
      return res.status(400).json({
        error: `The year does not have ${duration} months yet. Check this out and try again`,
      });
    }

    const { price } = await Membership.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails. One or more required fields are empty.',
      });
    }

    const { title } = req.body;
    if (title.length > 150) {
      return res
        .status(400)
        .json({ error: 'Title max size is set to 150 characters' });
    }

    const membershipId = req.params.id;

    const membership = await Membership.findByPk(membershipId);

    if (title !== membership.title) {
      const titleExists = await Membership.findOne({ where: { title } });

      if (titleExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const { duration } = req.body;
    if (duration > 12) {
      return res.status(400).json({
        error: `The year does not have ${duration} months yet. Check this out and try again`,
      });
    }

    const { price } = req.body;
    const { id } = await membership.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async show(req, res) {
    const response = await Membership.findAll();
    return res.json(response);
  }

  async delete(req, res) {
    const membership = await Membership.findByPk(req.params.id);

    await membership.destroy();

    return res
      .status(200)
      .json({ ok: `Membership: ${membership.title} deleted` });
  }
}

export default new MembershipController();
