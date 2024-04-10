import Joi from 'joi';

export const submitValidation = data => {
    const schema = Joi.object({
        first_name: Joi.string().min(1).max(255).required(),
        phone: Joi.string().min(11).max(12).required(),
    });
    return schema.validate(data);
}

