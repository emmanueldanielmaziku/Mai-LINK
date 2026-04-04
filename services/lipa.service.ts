import { success } from "zod";
import { prisma } from "../lib/prisma"
import { Lipa } from "../validators/lipa.validator";

//Adding a Lipa Number
async function addLipa(body: Lipa){
    const existing = await prisma.lipaNumber.findUnique({
        where: {
            businessNumber: body.lipa_number
        },
    });

    if(existing) {
        return { success: false, error: "Oops 🙊,Lipa number already exist!" };
    }

    const lipa = await prisma.lipaNumber.create({
        data: {
            businessName: body.lipa_name,
            businessNumber: body.lipa_number,
            network: body.lipa_network
        },
    });

    return {success: true, data: lipa}
}

//Getting Lipa number Details
async function getLipa(lipanumber: number){
    const lipaDetails = await prisma.lipaNumber.findUnique({
        where: {
            businessNumber: lipanumber,
        }
    });

    if(!lipaDetails){
        return {status: false, error: "Oops 🙊,Lipa number doesn't exist!"}
    }

    return {success: true, data: lipaDetails}
}



export default { addLipa, getLipa };