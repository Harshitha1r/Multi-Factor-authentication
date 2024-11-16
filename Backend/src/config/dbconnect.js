import {connect} from 'mongoose'

const connectMongoDB=async()=>{
    try {
        const mongodbConnection=await connect(process.env.COONECTION_STRING)
        console.log(`Database Connected ${mongodbConnection.connection.host}`)
    } catch (error) {
      console.log(`Unable to connect to DB ${error}`);
      process.exit(1)  
    }
}

export default connectMongoDB;