"use client"
import { Html } from 'slate-html-serializer';
import React, { useEffect, useState, useMemo } from "react";
import { useRef } from "react";
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'




export default function Home({ posts }) {

  const htmlToSlate = new Html({
    rules: [
      {
        deserialize: (el) => {
          if (el.tagName === 'p') {
            return { type: 'paragraph', children: [{ text: el.innerText }] };
          }
        },
      },
    ],
  });
  console.log({ posts });
  // const initialValue = [
  //   {
  //     type: 'paragraph',
  //     children: [{ text: 'A line of text in a paragraph.' }],
  //   },
  // ]
  const iframeRef = useRef(null);

  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Fetch the HTML content and set it in the state variable
    fetch('https://raw.githubusercontent.com/tanupriyaicd/pipeline2/master/index.html')
      .then(response => response.text())
      .then(data => {
        setHtmlContent(data);
      });
  }, []);
  
  const initialValue = useMemo(() => {
    return htmlToSlate.deserialize(htmlContent);
  }, [htmlContent]);
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <>
      <div>

        <h1>Hello, welcome to this blog</h1>
        <Slate editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>


      </div>
      <h1>Hello,welcome to this blog</h1>
      {
        posts.nodes.map(posts => {
          return (
            <ul key={posts.slug}>
              <li>{posts.title}</li>
            </ul>

          )
        })
      }
      <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    </>
  )
}
export async function getStaticProps() {
  const res = await fetch("http://192.168.1.109/wordpress/graphql", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
      query MyQuery {
        __typename
        posts {
          nodes {
            slug
            title
          }
        }
      }
      
      `,
    })
  })
  const json = await res.json()
  return {
    props: {
      posts: json.data.posts,
    },
  }
}