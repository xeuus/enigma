import debounce from 'lodash/debounce';
import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const WindowDimensionsContext = React.createContext<{
  width: number | null;
  height: number | null;
  isTablet: boolean;
  isMobile: boolean;
}>({
  width: 0,
  height: 0,
  isTablet: false,
  isMobile: false,
});

function useWindowDimensions() {
  return useContext(WindowDimensionsContext);
}

export const WindowDimensionsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  const updateDimensions = useRef(
    debounce(() => {
      setWindowDimensions(getWindowDimensions());
    }, 100),
  ).current;

  useEffect(() => {
    function handleResize() {
      updateDimensions();
    }

    if (hasWindow) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [updateDimensions, hasWindow]);

  return (
    <WindowDimensionsContext.Provider
      value={{
        ...windowDimensions,
        isTablet: Boolean(
          windowDimensions.width && windowDimensions.width < 1440,
        ),
        isMobile: Boolean(
          windowDimensions.width && windowDimensions.width < 1024,
        ),
      }}
    >
      {children}
    </WindowDimensionsContext.Provider>
  );
};

export default useWindowDimensions;
