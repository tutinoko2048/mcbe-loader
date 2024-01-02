
exports.ItemStack = class ItemStack {
  #data;
  constructor(data) {
    this.#data = data;
  }

  /** @type {string} */
  get typeId() {
    return this.#data.Name.value;
  }

  /** @type {number} */
  get amount() {
    return this.#data.Count.value;
  }

  toNbt() {
    return this.#data;
  }

  get extraData() {
    return (this.#data.tag && this.#data.tag.value) ?? {};
  }

  /** @type {number} */
  get data() {
    return this.#data.Damage.value;
  }

  /** @returns {number | undefined} */
  get durability() {
    return this.extraData.Damage?.value;
  }

  /** @returns {import('./types').Enchantment[]} */
  get enchantments() {
    const enchantmentList = this.extraData.ench?.value?.value;
    if (!Array.isArray(enchantmentList)) return [];
    return enchantmentList.map((ench) => ({
      id: ench.id.value,
      level: ench.lvl.value,
    }));
  }

  /** @type {string} */
  get nameTag() {
    return this.extraData.display?.value?.Name?.value ?? '';
  }

  get lore() {
    return this.extraData.display?.value?.Lore?.value.value ?? [];
  }

  get inventory() {
    const items = this.extraData.Items?.value?.value;
    if (!Array.isArray(items)) return;
    return items.map(i => new ItemStack(i))
  }

  toJSON() {
    /** @type {(keyof ItemStack)[]} */
    const valueList = [
      'typeId',
      'nameTag',
      'amount',
    ]
    return Object.fromEntries(valueList.map(k => [k, this[k]]));
  }
};
