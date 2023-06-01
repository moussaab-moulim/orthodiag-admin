import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { blogApi } from '../../__fake-api__/blog-api';
import { BlogNewsletter } from '../../components/blog/blog-newsletter';
import { BlogPostCard } from '../../components/blog/blog-post-card';
import { useMounted } from '../../hooks/use-mounted';
import { ArrowLeft as ArrowLeftIcon } from '../../icons/arrow-left';
import { gtm } from '../../lib/gtm';
import type { Post } from '../../types/blog';
import { PageLayout } from '@components/page-layout';

const BlogPostList: NextPage = () => {
  const isMounted = useMounted();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getPosts = useCallback(async () => {
    try {
      const data = await blogApi.getPosts();

      if (isMounted()) {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <PageLayout metaTitle={`Blog: Post List`}>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='md'>
          <Button
            component='a'
            startIcon={<ArrowLeftIcon fontSize='small' />}
            LinkComponent={NextLink}
            href='/dashboard'
          >
            Dashboard
          </Button>

          <Typography variant='h3' sx={{ mt: 3 }}>
            Blog Platform
          </Typography>
          <Card
            elevation={16}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 8,
              mt: 6,
              px: 3,
              py: 2,
            }}
          >
            <Typography variant='subtitle1'>Hello, Admin</Typography>

            <Button
              component='a'
              variant='contained'
              LinkComponent={NextLink}
              href='/blog/new'
            >
              New Post
            </Button>
          </Card>
          <Typography variant='h4'>Recent Articles</Typography>
          <Typography color='textSecondary' variant='subtitle1'>
            Discover the latest news, tips and user research insights from Acme.
          </Typography>
          <Typography color='textSecondary' variant='subtitle1'>
            You will learn about web infrastructure, design systems and devops
            APIs best practices.
          </Typography>
          <Divider sx={{ my: 3 }} />
          {posts.map((post) => (
            <BlogPostCard
              authorAvatar={post.author.avatar}
              authorName={post.author.name}
              category={post.category}
              cover={post.cover}
              key={post.title}
              publishedAt={post.publishedAt}
              readTime={post.readTime}
              shortDescription={post.shortDescription}
              title={post.title}
            />
          ))}
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
              mb: 8,
            }}
          >
            <Button disabled startIcon={<ArrowBackIcon fontSize='small' />}>
              Newer
            </Button>
            <Button
              endIcon={<ArrowForwardIcon fontSize='small' />}
              sx={{ ml: 1 }}
            >
              Older posts
            </Button>
          </Box>
          <Box sx={{ mt: 8 }}>
            <BlogNewsletter />
          </Box>
        </Container>
      </Box>
    </PageLayout>
  );
};

export default BlogPostList;
