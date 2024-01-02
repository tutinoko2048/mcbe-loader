class DynamicProperty {
  #data;
  constructor(data) {
    this.#data = data;
  }

  get(key) {
    const data = this.#data[key];
    if (!data) return;
    if (data.type === 'byte') return !!data.value;
    return data.value;
  }

  getIds() {
    return Object.keys(this.#data);
  }
}

class DynamicPropertyManager {
  #data;
  constructor(data) {
    this.#data = data;
  }

  getRegistry(packId) {
    const registryData = this.#data[packId]?.value;
    if (!registryData) return;
    return new DynamicProperty(registryData);
  }

  getRegistryKeys() {
    return Object.keys(this.#data);
  }

  getAllRegistries() {
    return this.getRegistryKeys().map(k => this.getRegistry(k));
  }
}

module.exports = { DynamicProperty, DynamicPropertyManager }