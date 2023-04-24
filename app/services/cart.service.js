const { ObjectId } = require("mongodb");

class CartService {
    constructor(client) {
        this.Cart = client.db().collection("carts");
        this.Users = client.db().collection("users");
        this.Product = client.db().collection("products");
    }

    extractData(payload) {
        const cart = {
            account_id: payload.account_id,
            product_list:[{
                product_id: payload.product_list[0].product_id,
                name: payload.product_list[0].name,
                price: payload.product_list[0].price,
                image: payload.product_list[0].image,
                number: payload.product_list[0].number,
            }],
        };
        // Remove undefined fields
        Object.keys(cart).forEach(
            (key) => cart[key] === undefined && delete cart[key]
        );
        return cart;
    }

    async create(payload) {
        const cart = this.extractData(payload);
        const cursor = await this.Cart.findOne({
            "account_id": cart.account_id
        });
//        console.log(cursor)
        if(cursor== null){
            const result = await this.Cart.insertOne(cart);
            console.log(result.value)
            return result.value;
        }else {
            const aval = await this.Cart.findOne({"account_id":cart.account_id,"product_list.product_id":cart.product_list[0].product_id})
//            console.log(aval)
            const tmp = await this.Cart.aggregate([
                {$unwind : '$product_list'},
                {$match: {
                    'product_list.product_id': cart.product_list[0].product_id,
                    "account_id":cart.account_id }
                },
            ]).toArray();
            console.log(tmp)
            if(aval == null){
                const result = await this.Cart.updateOne(
                    { "account_id": cart.account_id },
                    { $push: { product_list: cart.product_list[0] } }
                )
                return result.value;
            } else {
                const result = await this.Cart.updateOne(
                   {
                       "account_id":aval.account_id,
                   },
                   { $set: { "product_list.$[elem].number": cart.product_list[0].number + tmp[0].product_list.number }},
                   { arrayFilters: [ { "elem.product_id": cart.product_list[0].product_id } ]}
                )
                console.log(result.value)
                return result.value;
            }

        }
    }

    async findById(id){
        return await this.Cart.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByUserId(userid){
//        console.log(userid)
        const result = await this.Cart.findOne({
                             "account_id": userid
                         });
        return result;
    }

    async update(id, payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        const result = await this.Cart.findOneAndUpdate(
            filter,
            { $set: payload},
            { returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Cart.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async deleteAllProduct(user_id){
        const result = await this.Cart.updateOne(
              { "account_id": user_id },
              {
              $set: {
                  product_list: []
              }
        });
        return result.value;
    }

    async deleteProduct(id,product_id) {
        const filter = await this.Cart.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        const update = []
        for (let i = 0; i < filter.product_list.length; i++){
            if(filter.product_list[i].product_id != product_id){
                update.push(filter.product_list[i])
            }
        }
//        console.log(filter)
        const result = await this.Cart.updateOne(
            { "account_id": filter.account_id },
            {
                $set: {
                    product_list: update
                }
            });
        console.log(result.value)
        return result.value;
    }
}
module.exports = CartService;