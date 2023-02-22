import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import fs from "fs";
import path from "path";


// initialized the app - 
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// middleware -- 
app.use(cors());
app.use(express.json());


// data / json file imported from other folder ---- 
// import products from "./components/data/products.json" assert {type: "json"};
// const __dirname = path.dirname(new URL(import.meta.url).pathname)
const __dirname = path.resolve();
const productsFilePath = path.join(__dirname, "./", 'components', 'data', 'products.json');


async function run() {
    try {


        app.get("/", (req, res) => {
            res.status(200).send({
                success: true,
                data: "Bismillahir Rahmanir Rahim, useReducer Hook server is running well."
            })
        });

        // get all products --- 
        app.get("/products", (req, res) => {
            fs.readFile(productsFilePath, "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                    })
                }
                const products = JSON.parse(data);
                return res.status(200).send({
                    success: true,
                    data: products,
                })
            })
        });

        // add a product --- 
        app.post('/products', (req, res) => {
            fs.readFile(productsFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        acknowledge: false,
                    })
                }
                const _id = Math.round(Math.random() * 100);
                const newProduct = req.body;
                newProduct = {
                    ...newProduct,
                    _id,
                }
                const products = JSON.parse(data)
                products.push(newProduct);

                fs.writeFile(productsFilePath, JSON.stringify(products), "utf8", (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            success: false,
                            acknowledge: false,
                        })
                    }
                    return res.send({
                        success: true,
                        acknowledge: true,
                        insertedId: _id,
                    })
                })
            })
        })


        app.delete("/product/:id", (req, res) => {
            fs.readFile(productsFilePath, "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        success: false,
                        acknowledge: false,
                    });
                };
                const id = req.params.id;
                const products = JSON.parse(data);
                const index = products.findIndex(p => p._id === id);
                if (index === -1) {
                    return res.status(404).send({
                        success: false,
                        acknowledge: false,
                        message: `Product with id ${id} not found`,
                    });
                };
                products.splice(index, 1)
                fs.writeFile(productsFilePath, JSON.stringify(products), "utf8", (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            success: false,
                            acknowledge: false,
                        });
                    };
                    return res.status(200).send({
                        success: true,
                        acknowledge: true,
                        message: `Product id ${id} successfully deleted.`,
                    })
                })
            })
        })

    } catch (error) {
        console.log(`error from run function under => try => catch section: ${error}`.bgRed)
    }

}
run().catch(error => console.log(`error from run function catch section: ${error}`.bgRed))

app.listen(port, () => console.log(`userReducer Hook project server running: ${port}`.bgCyan))