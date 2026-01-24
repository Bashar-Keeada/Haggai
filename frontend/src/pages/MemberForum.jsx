import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, User, MessageCircle, Plus, Send, Loader2, Clock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberForum = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const translations = {
    sv: {
      title: 'Diskussionsforum',
      back: 'Tillbaka',
      newPost: 'Nytt inlägg',
      createPost: 'Skapa inlägg',
      postTitle: 'Rubrik',
      postContent: 'Innehåll',
      cancel: 'Avbryt',
      create: 'Skapa',
      reply: 'Svara',
      replies: 'svar',
      writeReply: 'Skriv ett svar...',
      send: 'Skicka',
      noPosts: 'Inga inlägg ännu',
      noPostsDesc: 'Var den första att starta en diskussion!',
      backToForum: 'Tillbaka till forumet',
      postedBy: 'Skrivet av',
      creating: 'Skapar...',
      sending: 'Skickar...'
    },
    en: {
      title: 'Discussion Forum',
      back: 'Back',
      newPost: 'New post',
      createPost: 'Create post',
      postTitle: 'Title',
      postContent: 'Content',
      cancel: 'Cancel',
      create: 'Create',
      reply: 'Reply',
      replies: 'replies',
      writeReply: 'Write a reply...',
      send: 'Send',
      noPosts: 'No posts yet',
      noPostsDesc: 'Be the first to start a discussion!',
      backToForum: 'Back to forum',
      postedBy: 'Posted by',
      creating: 'Creating...',
      sending: 'Sending...'
    },
    ar: {
      title: 'منتدى النقاش',
      back: 'رجوع',
      newPost: 'منشور جديد',
      createPost: 'إنشاء منشور',
      postTitle: 'العنوان',
      postContent: 'المحتوى',
      cancel: 'إلغاء',
      create: 'إنشاء',
      reply: 'رد',
      replies: 'ردود',
      writeReply: 'اكتب رداً...',
      send: 'إرسال',
      noPosts: 'لا توجد منشورات بعد',
      noPostsDesc: 'كن أول من يبدأ النقاش!',
      backToForum: 'العودة للمنتدى',
      postedBy: 'بواسطة',
      creating: 'جاري الإنشاء...',
      sending: 'جاري الإرسال...'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchData();
  }, [postId]);

  const fetchData = async () => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/medlem-login');
      return;
    }

    try {
      // Get current member
      const meRes = await fetch(`${BACKEND_URL}/api/members/me?token=${token}`);
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentMemberId(meData.id);
      }

      if (postId) {
        // Fetch single post
        const postRes = await fetch(`${BACKEND_URL}/api/forum/${postId}?token=${token}`);
        if (postRes.ok) {
          const postData = await postRes.json();
          setCurrentPost(postData);
        }
      } else {
        // Fetch all posts
        const postsRes = await fetch(`${BACKEND_URL}/api/forum?token=${token}`);
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      }
    } catch (error) {
      console.error('Error fetching forum data:', error);
      toast.error('Kunde inte hämta forumdata');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setSubmitting(true);
    const token = localStorage.getItem('memberToken');

    try {
      const response = await fetch(`${BACKEND_URL}/api/forum?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPostTitle.trim(),
          content: newPostContent.trim()
        })
      });

      if (response.ok) {
        toast.success('Inlägg skapat!');
        setShowNewPostDialog(false);
        setNewPostTitle('');
        setNewPostContent('');
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunde inte skapa inlägg');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Ett fel uppstod');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    const token = localStorage.getItem('memberToken');

    try {
      const response = await fetch(`${BACKEND_URL}/api/forum/${postId}/reply?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent.trim() })
      });

      if (response.ok) {
        setReplyContent('');
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunde inte skicka svar');
      }
    } catch (error) {
      console.error('Error replying:', error);
      toast.error('Ett fel uppstod');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haggai"></div>
      </div>
    );
  }

  // Single Post View
  if (postId && currentPost) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 pt-16 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="bg-haggai text-white py-8">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/mina-sidor/forum')}
              className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {txt.backToForum}
            </Button>
            <h1 className="text-2xl font-bold">{currentPost.title}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Original Post */}
          <Card className="border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                  {currentPost.author_image ? (
                    <img src={currentPost.author_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-stone-300" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-stone-800">{currentPost.author_name}</p>
                  <p className="text-sm text-stone-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(currentPost.created_at).toLocaleDateString('sv-SE')}
                  </p>
                </div>
              </div>
              <p className="text-stone-700 whitespace-pre-wrap">{currentPost.content}</p>
            </CardContent>
          </Card>

          {/* Replies */}
          <h3 className="text-lg font-bold text-stone-800 mb-4">
            {currentPost.replies?.length || 0} {txt.replies}
          </h3>

          <div className="space-y-4 mb-6">
            {currentPost.replies?.map((reply) => (
              <Card key={reply.id} className="border-0 shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                      {reply.author_image ? (
                        <img src={reply.author_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-stone-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-stone-800">{reply.author_name}</p>
                        <span className="text-xs text-stone-400">
                          {new Date(reply.created_at).toLocaleDateString('sv-SE')}
                        </span>
                      </div>
                      <p className="text-stone-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <form onSubmit={handleReply} className="flex gap-2">
                <Input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={txt.writeReply}
                  className="flex-1"
                  disabled={submitting}
                />
                <Button type="submit" disabled={submitting || !replyContent.trim()} className="bg-haggai hover:bg-haggai-dark">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Forum List View
  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 pt-16 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-haggai text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/mina-sidor')}
                className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {txt.back}
              </Button>
              <h1 className="text-2xl font-bold">{txt.title}</h1>
            </div>
            <Button
              onClick={() => setShowNewPostDialog(true)}
              className="bg-white text-haggai hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {txt.newPost}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {posts.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 text-lg">{txt.noPosts}</p>
              <p className="text-stone-400 mt-1">{txt.noPostsDesc}</p>
              <Button
                onClick={() => setShowNewPostDialog(true)}
                className="mt-6 bg-haggai hover:bg-haggai-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                {txt.newPost}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.id} to={`/mina-sidor/forum/${post.id}`}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {post.author_image ? (
                          <img src={post.author_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-stone-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-stone-800 text-lg mb-1">{post.title}</h3>
                        <p className="text-stone-600 line-clamp-2 mb-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-stone-500">
                          <span>{txt.postedBy} {post.author_name}</span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString('sv-SE')}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.replies?.length || 0} {txt.replies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{txt.createPost}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{txt.postTitle}</label>
              <Input
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder={txt.postTitle}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{txt.postContent}</label>
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={txt.postContent}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
              {txt.cancel}
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={submitting || !newPostTitle.trim() || !newPostContent.trim()}
              className="bg-haggai hover:bg-haggai-dark"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {txt.creating}
                </>
              ) : (
                txt.create
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberForum;
