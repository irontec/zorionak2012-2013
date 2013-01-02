killall mplayer
sleep 1
#hacemos una copia de seguridad de todo lo capturado hasta ahora
T="$(date +%Y%m%d.%H%M%S)"
mv /root/capture "/root/capture$T"

#recreamos el directorio "destino"
mkdir /root/capture

mplayer tv:// -vf framestep=15 -vo jpeg:quality=37:smooth=40:outdir=/root/capture/:subdirs=prefix:maxfiles=100
