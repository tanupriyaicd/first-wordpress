

export default function Post(data){
    console.log({data})
return (
    <h1>Howdy</h1>
)
}
export async function getStaticProps(context){
    const res=await fetch('http://192.168.1.109/wordpress/graphql',{
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify({
            query:`
            query SinglePost($id: ID!, $idType:PostIdType!)
            {
               post(id: $id, idType:$idType){
                title
                slug
                content
                featuredImage{
                    node{
                        sourceUrl
                    }
                }
               }
            }`,
            variables:{
                id: context.params.slug,
                idType:'SLUG'
            }
        })
    })
    const json=await res.json()
    return {
        props:{
            post: json.data.post,
        },
    }
}

export async function getStaticPaths(){
    const res=await fetch('http://192.168.1.109/wordpress/graphql',{
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify({
            query:`
            query AllPostsQuery
            {
               posts{
                nodes{ 
               
                slug
                content
                title
                featuredImage{
                    node{
                        sourceUrl
                    }
                }
               }}
            }`,
           
        })
    })
   const json=await res.json()
   const posts=json.data.posts.nodes;
   const paths=posts.map((post)=>({
    params: {slug: post.slug},
   }))
   return {paths,fallback:false}
}