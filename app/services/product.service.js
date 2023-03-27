const { ObjectId } = require("mongodb");

class ProductService {
    constructor(client) {
        this.Product = client.db().collection("products");
    }

    extractProductData(payload) {
        const product = {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            quantity: payload.quantity,
            image: payload.image,
            available: payload.available,
            manufacture: payload.manufacture,
            brand:payload.brand,
        };
        // Remove undefined fields
        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            product,
            { $set: { available: true  } },
            { returnDocumnet: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter){
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            name: {$regex:new RegExp(name), $options: "i"},
        });
    }

    async findById(id){
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        const update = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findAllAvailable() {
        return await this.find({ available: true });
    }

    async deleteAll() {
        const result = await this.Product.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = ProductService;