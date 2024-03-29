import React, {FC, useState, useEffect, useContext} from 'react';

const MaxMobileWidth = 768;
const MaxTabletWidth = 980;

export function tablet(css: string): string {
  return `@media (min-width: ${MaxMobileWidth}px) {
    ${css}
  }`;
}

export function pc(css: string): string {
  return `@media (min-width: ${MaxTabletWidth}px) {
    ${css}
  }`;
}

enum Device {
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Pc = 'Pc',
}

const DeviceContext = React.createContext<Device>(Device.Mobile);

function deviceFromWidth(width: number): Device {
  if (width < 768) {
    return Device.Mobile;
  } else if (width < 980) {
    return Device.Tablet;
  } else {
    return Device.Pc;
  }
}

export const Responsive: FC<{}> = ({children}) => {
  const [device, setDevice] = useState(
    deviceFromWidth(window.parent.screen.width),
  );

  useEffect(() => {
    const resize = () => {
      const curDevice = deviceFromWidth(window.parent.screen.width);
      if (curDevice !== device) {
        setDevice(curDevice);
      }
    };

    resize();

    window.onresize = resize;

    return () => {
      window.onresize = null;
    };
  }, [device, setDevice]);

  console.log(device);

  return (
    <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
  );
};

interface ContentProps {
  children: React.ReactNode;
}

const genDeviceContent: (device: Device) => FC<ContentProps> = device => ({
  children,
}) => {
  const curDevice = useContext(DeviceContext);

  return <>{curDevice === device ? children : null}</>;
};

export const Pc: FC<ContentProps> = React.memo(genDeviceContent(Device.Pc));
export const Tablet: FC<ContentProps> = React.memo(
  genDeviceContent(Device.Tablet),
);
export const Mobile: FC<ContentProps> = React.memo(
  genDeviceContent(Device.Mobile),
);
