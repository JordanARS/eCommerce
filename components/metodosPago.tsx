'use client';
import Image from 'next/image';

export default function MetodosPago() {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-center text-gray-500 text-sm mb-3 font-semibold">Métodos de pago seguros</p>
            <div className="flex justify-center gap-4 transition-all">
                <div className="h-12 w-15.5 rounded flex items-center justify-center overflow-hidden">
                    <Image
                        src="/metodosPago/mastercard.svg"
                        alt="Mastercard"
                        width={56}
                        height={40}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="h-12 w-12 rounded flex items-center justify-center overflow-hidden">
                    <Image
                        src="/metodosPago/pse.svg"
                        alt="PSE"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />

                </div>
                <div className="h-12 w-31 bg-gray-300 flex items-center justify-center overflow-hidden">
                    <Image
                        src="/metodosPago/ePayco.svg"
                        alt="ePayco"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />

                </div>
            </div>
        </div>
    );
}