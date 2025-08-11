import { savePostDraft, useBlogPost } from '@/lib/blog';
import { useOrganization } from '@clerk/clerk-expo';
import { useHeaderHeight } from '@react-navigation/elements';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
export default function EditorWebView() {
    const headerHeight = useHeaderHeight();
    const theme = useTheme();
    const [content, setContent] = useState<string | null>(null);
    const params = useLocalSearchParams();
    const organization = useOrganization();
    const post = useBlogPost(organization.organization?.slug || "", params.id as string);
    const [hasLoadedInitialContent, setHasLoadedInitialContent] = useState(false);
    useEffect(() => {
        if (post.loaded && !hasLoadedInitialContent) {
            setContent(post.data?.draftContent);
            setHasLoadedInitialContent(true);
        }
    }, [post.data]);
    useEffect(() => {
        if (content && hasLoadedInitialContent) {
            savePostDraft(organization.organization?.slug || "", params.id as string, content);
        }
    }, [content]);
  const webViewRef = useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  // Memoize the HTML template to prevent unnecessary re-renders
  const htmlContent = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/list@latest"></script>
        <script src="https://cdn.jsdelivr.net/npm/@editorjs/embed@latest"></script>
        <script src="https://cdn.jsdelivr.net/npm/editorjs-alert@latest"></script>
    </head>
    <body style="background-color: ${theme.colors.background}; margin: 0; padding: 16px; color: ${theme.colors.onBackground};">
      <div id="editorjs"></div>
      <script>
        let editor;
        
        function initEditor(initialData) {
          if (editor) {
            // If editor already exists, just update the content
            return editor.isReady.then(() => {
              return editor.render(initialData);
            });
          }
          
          // Create new editor instance
          editor = new EditorJS({
            holder: 'editorjs',
            placeholder: "Write something...",
            tools: {
              header: Header,
              List: {
                class: EditorjsList,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'unordered'
                },
              },
              embed: {
                class: Embed,
                inlineToolbar: true,
                config: {
                  services: {
                    youtube: true,
                    vimeo: true,
                    instagram: true,
                    twitter: true,
                    facebook: true,
                    tiktok: true,
                    soundcloud: true,
                    spotify: true,
                    codepen: true,
                    jsfiddle: true,
                    replit: true,
                  }
                }
              },
              alert: Alert,
            },
            data: initialData,
            onReady: () => {
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'ready'}));
            },
            onChange: (api, data) => {
              editor.save().then((data) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'save', data}));
              });
            }
          });
          
          return editor.isReady;
        }
        
        // Handle messages from React Native
        document.addEventListener('message', function(event) {
          const data = JSON.parse(event.data);
          if (data.type === 'updateContent') {
            initEditor(data.data);
          }
        });
        
        // Initial editor setup with empty data
        initEditor(${JSON.stringify(content)});
      </script>
    </body>
    </html>
  `, [theme.colors.background, theme.colors.onBackground]);

  return (
    <>
    <Stack.Screen options={{headerShown: true, header: () => <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Post Editor`} />
    </Appbar.Header>}} />
    {post.loaded && (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: "wh" }}
        keyboardVerticalOffset={-headerHeight}
      >
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={{ flex: 1 }}
          onMessage={(e) => {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.type === 'save') {
              setContent(data.data);
            } else if (data.type === 'ready') {
              setIsWebViewReady(true);
            }
          }}
          onLoadEnd={() => {
            if (webViewRef.current) {
              // Send initial content after WebView is loaded
              webViewRef.current.injectJavaScript(`
                (function() {
                  const data = ${JSON.stringify(content)};
                  document.dispatchEvent(new MessageEvent('message', {data: JSON.stringify({type: 'updateContent', data})}));
                  true;
                })();
              `);
            }
          }}
        />
      </KeyboardAvoidingView>
    )}
    </>
  );
}