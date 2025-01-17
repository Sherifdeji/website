/* eslint-disable react/prop-types */
import clsx from 'clsx';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import remarkGfm from 'remark-gfm';

import CodeTabs from 'components/pages/doc/code-tabs';
import CommunityBanner from 'components/pages/doc/community-banner';
import DefinitionList from 'components/pages/doc/definition-list';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import DocsList from 'components/pages/doc/docs-list';
import IncludeBlock from 'components/pages/doc/include-block';
import InfoBlock from 'components/pages/doc/info-block';
import Tabs from 'components/pages/doc/tabs';
import TabItem from 'components/pages/doc/tabs/tab-item';
import TechnologyNavigation from 'components/pages/doc/technology-navigation';
import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import SubscriptionForm from 'components/pages/use-case/subscription-form';
import Testimonial from 'components/pages/use-case/testimonial';
import TestimonialsWrapper from 'components/pages/use-case/testimonials-wrapper';
import UseCaseContext from 'components/pages/use-case/use-case-context';
import UseCaseList from 'components/pages/use-case/use-case-list';
import Admonition from 'components/shared/admonition';
import AnchorHeading from 'components/shared/anchor-heading';
import CodeBlock from 'components/shared/code-block';
import ComputeCalculator from 'components/shared/compute-calculator';
import CtaBlock from 'components/shared/cta-block';
import Link from 'components/shared/link';
import getCodeProps from 'lib/rehype-code-props';

import sharedMdxComponents from '../../../../content/docs/shared-content';
import DocCta from '../doc-cta';
import ImageZoom from '../image-zoom';
import RegionRequest from '../region-request';

const sharedComponents = Object.keys(sharedMdxComponents).reduce((acc, key) => {
  acc[key] = () => IncludeBlock({ url: sharedMdxComponents[key] });
  return acc;
}, {});

const getHeadingComponent = (heading, withoutAnchorHeading, isPostgres) => {
  if (withoutAnchorHeading) {
    return heading;
  }
  if (isPostgres) {
    return AnchorHeading(heading);
  }

  return AnchorHeading(heading);
};

const getComponents = (withoutAnchorHeading, isReleaseNote, isPostgres, isUseCase) => ({
  h2: getHeadingComponent('h2', withoutAnchorHeading, isPostgres),
  h3: getHeadingComponent('h3', withoutAnchorHeading, isPostgres),
  h4: getHeadingComponent('h4', withoutAnchorHeading, isPostgres),
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  // eslint-disable-next-line react/jsx-no-useless-fragment
  undefined: (props) => <Fragment {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  a: (props) => {
    const { href, children, ...otherProps } = props;
    if (children === '#id') {
      const id = href?.startsWith('#') ? href.replace('#', '') : undefined;
      return <span id={id} />;
    }

    return (
      <Link to={href} {...otherProps}>
        {children}
      </Link>
    );
  },
  img: (props) => {
    const { className, title, src, ...rest } = props;
    return isPostgres ? (
      // No zoom on PostgreSQLTutorial Images
      src.includes('?') ? (
        // Authors can use anchor tags to make images float right/left
        <Image
          className={clsx(
            className,
            {
              'no-border':
                title === 'no-border' || src.includes('alignleft') || src.includes('alignright'),
            },
            { 'float-right clear-left p-4 grayscale filter': src.includes('alignright') },
            { 'float-left clear-right p-4 grayscale filter': src.includes('alignleft') }
          )}
          src={src.split('?')[0]}
          width={100}
          height={100}
          style={{ width: 'auto', height: 'auto', maxWidth: '128px', maxHeight: '128px' }}
          title={title !== 'no-border' ? title : undefined}
          {...rest}
        />
      ) : (
        <Image
          className={clsx(className, { 'no-border': title === 'no-border' })}
          src={src}
          width={200}
          height={100}
          style={{ width: 'auto', height: 'auto' }}
          title={title !== 'no-border' ? title : undefined}
          {...rest}
        />
      )
    ) : (
      <ImageZoom src={src}>
        <Image
          className={clsx(className, { 'no-border': title === 'no-border' })}
          src={src}
          width={isReleaseNote ? 762 : 796}
          height={isReleaseNote ? 428 : 447}
          style={{ width: '100%', height: '100%' }}
          title={title !== 'no-border' ? title : undefined}
          {...rest}
        />
      </ImageZoom>
    );
  },
  YoutubeIframe,
  DefinitionList,
  Admonition,
  CodeTabs,
  DetailIconCards,
  TechnologyNavigation,
  CommunityBanner,
  Tabs,
  TabItem,
  InfoBlock,
  DocsList,
  RegionRequest,
  CTA: isUseCase ? CtaBlock : DocCta,
  Testimonial,
  TestimonialsWrapper,
  UseCaseList,
  UseCaseContext,
  ComputeCalculator,
  SubscriptionForm,
  ...sharedComponents,
});

// eslint-disable-next-line no-return-assign
const Content = ({
  className = null,
  content,
  asHTML = false,
  withoutAnchorHeading = false,
  isReleaseNote = false,
  isPostgres = false,
  isUseCase = false,
}) => (
  <div
    className={clsx(
      'prose-doc prose dark:prose-invert xs:prose-code:break-words',
      className,
      { 'leading-8': isPostgres },
      {
        'dark:prose-p:text-gray-new-70 dark:prose-strong:text-white dark:prose-li:text-gray-new-70 dark:prose-table:text-gray-new-70':
          isUseCase,
      }
    )}
  >
    {asHTML ? (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      <MDXRemote
        components={getComponents(withoutAnchorHeading, isReleaseNote, isPostgres, isUseCase)}
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [
              // Adds support for GitHub Flavored Markdown
              remarkGfm,
            ],
            rehypePlugins: [getCodeProps],
          },
        }}
      />
    )}
  </div>
);
Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  asHTML: PropTypes.bool,
  withoutAnchorHeading: PropTypes.bool,
  isReleaseNote: PropTypes.bool,
  isPostgres: PropTypes.bool,
};

export default Content;
