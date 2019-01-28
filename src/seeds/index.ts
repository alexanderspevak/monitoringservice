import { User } from '../entity'

export function seeding(connection:any) {
    const userRepository = connection.getRepository(User)
    var seeds = [{
        name: "Applifting",
        email: "info@applifting.cz",
        accessToken: "93f39e2f-80de-4033-99ee-249d92736a25"
    },
    {   name: "Batman",
        email: "batman@example.com",
        accessToken: "dcb20f8a-5657-4f1b-9f7f-ce65739b359e"
    }]
    seeds.forEach(async (seed) => {
        const findResult = await userRepository.findOne({
            userName: seed.name,
            email: seed.email,
            accessToken: seed.accessToken
        })
        if (!findResult) {
            const user = new User();
            user.userName = seed.name
            user.email = seed.email
            user.accessToken = seed.accessToken
            await userRepository.save(user)
        }
    })
}