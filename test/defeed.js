const { assert } = require('chai')

const DeFeed= artifacts.require('./DeFeed.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Defeed', ([deployer, author, donator]) => {
    let defeed

    before(async () => {
        defeed= await DeFeed.deployed()
    })

    describe('deployment', async () => {
        it('deploys succesfully', async()=> {
            const address= await defeed.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async()=> {
            const name = await defeed.name()
            assert.equal(name, 'DeFeed')
        })
    })

    describe('posts', async()=> {
        let result, postCount
        const hash= 'hash123'

        before(async () => {
            result= await defeed.uploadPost(hash, 'Post Description', {from: author})
            postCount= await defeed.postCount()
        })

        it('creates posts', async()=> {
            //SUCCESS
            assert.equal(postCount, 1)
            const event= result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Post Description', 'description is correct')
            assert.equal(event.donation, '0', 'donation is correct')
            assert.equal(event.author, author, 'author is correct')

            //FAILURE: Post must have hash
            await defeed.uploadPost('', 'Post Description', {from: author}).should.be.rejected;

            //FAILURE: Post must have description
            await defeed.uploadPost('Post hash', '', {from: author}).should.be.rejected;
        })

        //Check from Struct
        it('lists posts', async()=> {
            const post= await defeed.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.hash, hash, 'Hash is correct')
            assert.equal(post.description, 'Post Description', 'description is correct')
            assert.equal(post.donation, '0', 'donation is correct')
            assert.equal(post.author, author, 'author is correct')
        }) 

        it('allows users to donate on posts', async()=> {
            //Track author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance= await web3.eth.getBalance(author)
            oldAuthorBalance= new web3.utils.BN(oldAuthorBalance)

            result= await defeed.donatePostAuthor(postCount, {from: donator, value: web3.utils.toWei('1', 'Ether')})

            //SUCCESS
            const event= result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Post Description', 'description is correct')
            assert.equal(event.donation, '1000000000000000000', 'donation is correct')
            assert.equal(event.author, author, 'author is correct')

            //Check that author recieved donation
            let newAuthorBalance
            newAuthorBalance= await web3.eth.getBalance(author)
            newAuthorBalance= new web3.utils.BN(newAuthorBalance)

            let donatePostAuthor
            donatePostAuthor= web3.utils.toWei('1', 'Ether')
            donatePostAuthor= new web3.utils.BN(donatePostAuthor)

            const expectedBalance= oldAuthorBalance.add(donatePostAuthor)

            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            //FAILURE: Tries to donate to a post that does not exist
            await defeed.donatePostAuthor(99, {from: donator, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

        })
    })
})