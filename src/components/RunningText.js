import React from "react";
const RunningText = () => {
  return (
    <div className="flex mt-2 mb-2 bg-hollandtints-800 ">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <h3 className="text-3xl font-medium m-3 text-white">
            Silahkan Pilih produk, Untuk Keluhan dan Pengajuan Refund Hubungi
            (021) 4700212
          </h3>
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
          <h3 className="text-3xl font-medium m-3 text-white">
            Silahkan Pilih produk, Untuk Keluhan dan Pengajuan Refund Hubungi
            (021) 4700212
          </h3>
        </div>
      </div>
    </div>
  );
};

export default RunningText;
