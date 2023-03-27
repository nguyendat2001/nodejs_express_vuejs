const { ObjectId } = require("mongodb");

class OrderService {
    constructor(client) {
        this.Order = client.db().collection("orders");
        this.Product = client.db().collection("products");
    }

    extractData(payload) {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        // prints date & time in YYYY-MM-DD HH:MM:SS format
        const dateTime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
        console.log(dateTime)

        const order = {
            user_id: payload.user_id,
            product_list: payload.product_list,
            total_cost: payload.total_cost,
            date_time: dateTime,
            destination: payload.destination,
            status: payload.status,
        };
        // Remove undefined fields
        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );
        return order;
    }

    async create(payload) {
        const order = this.extractData(payload);
//        let date_ob = new Date();
//        let date = ("0" + date_ob.getDate()).slice(-2);
//        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//        let year = date_ob.getFullYear();
//        let hours = date_ob.getHours();
//        let minutes = date_ob.getMinutes();
//        let seconds = date_ob.getSeconds();
//        const date_time = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
        const result = await this.Order.insertOne(
            order,
            { $set: { status: false } }
        );
        return result.value;
    }

    async find(filter){
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }

    async findById(id){
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        const update = this.extractData(payload);
        const result = await this.Order.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after"}
        );
        return result.value;
    }

     async approveById(id){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        const result = await this.Order.findOneAndUpdate(
            filter,
            { $set: { status: true }},
            { returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Order.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findUnApprove() {
        return await this.find({ status: false });
    }
}
module.exports = OrderService;