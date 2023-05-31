import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import {
  toast,
  ToastContent,
  ToastOptions,
  UpdateOptions,
} from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface IRefreashOptions {
  reload?: boolean;
  urlParams?: ParsedUrlQuery | string;
  shallow?: boolean;
}

export const useCommon = () => {
  const router = useRouter();
  const locale = router.locale ?? 'fr';
  const { t } = useTranslation();

  const refreashPage = async (options?: IRefreashOptions) => {
    if (options?.reload) await router.reload();
    else {
      const query = options?.urlParams
        ? typeof options.urlParams === 'string' &&
          options.urlParams.startsWith('?')
          ? options.urlParams.replace('?', '')
          : options.urlParams
        : router.query;
      await router.replace(
        {
          pathname: router.asPath.split('?')[0],
          query: query,
        },
        undefined,
        {
          scroll: false,
          shallow: options?.shallow,
        }
      );
    }
  };
  const showSuccessNotification = (
    message: ToastContent,
    options?: ToastOptions
  ) => toast.success(message, options);

  const showErrorNotification = (
    message: ToastContent,
    options?: ToastOptions
  ) => toast.error(message, options);

  const showApiCallNotification = <T,>(
    promise: Promise<T>,
    message: {
      success?: string;
      pending?: string;
      error?: string | UpdateOptions<any>;
    },
    id?: any,
    options?: ToastOptions
  ) => {
    return toast.promise<T>(
      promise,
      {
        success: message.success,
        pending: message.pending,
        error: message.error,
      },
      {
        toastId: id,
        ...options,
      }
    );
  };

  return {
    refreashPage,
    showErrorNotification,
    showSuccessNotification,
    showApiCallNotification,
    locale,
  };
};
