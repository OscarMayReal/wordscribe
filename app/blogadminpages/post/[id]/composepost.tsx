import { useBlogPost } from '@/lib/blog';
import { useOrganization } from '@clerk/clerk-expo';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
export default function EditorWebView() {
    const theme = useTheme();
    const [content, setContent] = useState<string | null>(null);
    const params = useLocalSearchParams();
    const organization = useOrganization();
    const post = useBlogPost(organization.organization?.slug || "", params.id as string);
    const [hasLoadedInitialContent, setHasLoadedInitialContent] = useState(false);
    useEffect(() => {
        if (post.loaded && !hasLoadedInitialContent) {
            setContent(post.data?.content);
            setHasLoadedInitialContent(true);
        }
    }, [post.data]);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/list@latest"></script>
    </head>
    <body style="background-color: ${theme.colors.background}; margin: 0; padding: 16px; color: ${theme.colors.onBackground};">
      <div id="editorjs"></div>
      <script>
        const editor = new EditorJS({
          holder: 'editorjs',
          tools: {
            header: Header,
            List: {
                class: EditorjsList,
                inlineToolbar: true,
                config: {
                    defaultStyle: 'unordered'
                },
            },
          },
          data: ${JSON.stringify(content)},
          onReady: (api) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'ready'}));
          },
          onChange: (api, data) => {
            editor.save().then((data) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'save', data}));
            });
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <>
    <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Post Editor`} />
    </Appbar.Header>}} />
    {post.loaded && <WebView
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
      onMessage={(e) => {
        console.log(e);
        const data = JSON.parse(e.nativeEvent.data);
        console.log(data);
        if (data.type === 'save') {
            setContent(data.data);
        }
      }}
    />}
    </>
  );
}