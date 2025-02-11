/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */
const getItems = (req, res) => {
    const data = ["hola", "mundo"]
    res.send({data})
   }
   const getItem = (req, res) => {
       // Implement getItem logic here
       res.send({ message: "getItem" });
   }
   const createItem = (req, res) => {
       // Implement createItem logic here
       res.send({ message: "createItem" });
   }
   const updateItem = (req, res) => {
       // Implement updateItem logic here
       res.send({ message: "updateItem" });
   }
   const deleteItem = (req, res) => {
       // Implement deleteItem logic here
       res.send({ message: "deleteItem" });
   }
   module.exports = { getItems, getItem,
   createItem, updateItem,
   deleteItem };