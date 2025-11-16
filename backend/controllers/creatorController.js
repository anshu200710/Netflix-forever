// backend/controllers/creatorController.js
import slugify from "slugify";
import Creator from "../models/Creator.js";

export const createCreator = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    let baseSlug =
      slugify(name, { lower: true, strict: true }) || "user";
    let slug = baseSlug;
    let count = 1;

    // ensure unique slug
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await Creator.findOne({ slug });
      if (!existing) break;
      slug = `${baseSlug}${count++}`;
    }

    const creator = await Creator.create({ name, slug });
    res.status(201).json({ ok: true, creator });
  } catch (err) {
    next(err);
  }
};

export const getCreatorById = async (req, res, next) => {
  try {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    res.json(creator);
  } catch (err) {
    next(err);
  }
};
