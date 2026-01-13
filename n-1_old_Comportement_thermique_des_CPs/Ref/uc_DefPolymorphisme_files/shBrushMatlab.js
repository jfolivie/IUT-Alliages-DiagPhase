/**
 *  Author: Fabien . Baillon @ mines-albi . fr
 *  based on: http://www.jamesrohal.com
 */
SyntaxHighlighter.brushes.MatlabKey = function()
{
  var keywords = 'all break case catch classdef continue else elseif end for function global if otherwise parfor persistent return spmd switch try while or';
  var constants = 'i j e pi TRUE FALSE';
  var variable = 'ans';
  var functions =	'abs acosacosh addpath asin asind asinh atan atan2 atand atanh axes axis balance bar barh bar3 bar3h besselh besseli besselj besselk bessely cart2pol cart2sph cat caxis cd ceil cell cell2mat cell2struct celldisp cellfun cellplot cellstr cgs char cla clabel class classdef clc clear clearvars clf clipboard colorbar colordef colormap colormapeditor commandhistory commandwindow complex computer continue contour contour3 contourc contourf Properties conv conv2 cos cosd cosh cot cotd coth cov csvread csvwrite debug delete deleteproperty demo depdir depfun det deval diag dialog diary diff diffuse dir disp display divergence doc docopt docsearch dos dot double echo echodemo edit eig eigs eps eq erf erfc erfcx error errorbar eval evalc events Execute exit exp eye factor factorial  fclose feof ferror feval fft fft2 fftn fgets figure find findall finish floor flow fminbnd fminsearch fopen format fplot fprintf fread fscanf ftp full fwrite fzero gallery gamma gca gcbf gcbo gcd gcf gco ge get getenv gplotgradient grid griddata gunzip gzip handle help helpbrowser helpdesk helpdlg helpwin hidden hist hold home hsv2rgb image import Inf info inline input int2str interp1 interp1q interp2 interp3 interpft interpn inv keyboard keys le legend legendre length license light line linsolve linspace list load log log10 log1p log2 logical loglog logm logspace ls lu matlab max mean median menu mesh meshc meshz meshgrid min mkdir mod mode more move movie movie2avi mput mtimes NaN ne newplot norm normest not null ode15i ode23 ode45 ode113 ode15s ode23s ode23t ode23tb odefile odeget odeset ones open openfig opengl openvar optimget optimset otherwise path pause plot plot3 plotyy pol2cart polar poly polyarea polyfit polyval pow2 power prefdir preferences primes print pwd quit quiver quiver3 rand rand randi randi randn randn refresh regexp release rem remove rename reset reshape residue return rmdir root object rot90 rotate rotate3d round run save save saveas semilogx semilogy set setenv sign sin sind single sinh sizesort sortrows sparsespeye spline spy sqrt start std stop struct subplot sum surf surfc surface surfl system tan tand tanh tar text throw tic toc timer title trace transpose trapz treelayout treeplot tril trimesh type union unique unix unloadlibrary untar unwrap unzip upper urlread urlwrite userpath values var varargin varargout vectorize ver verctrl version vertcat view wait waitbar waitfor warning waterfall web what whatsnew which whitebg who whos workspace xlabel ylabel zlabel xlim ylim zlim xlsfinfo xlsread xlswrite xmlread xmlwrite xor xslt zeros zip zoom';
  this.regexList = [
    { regex: /%.*$/gm,  css: 'comments' }, // one line comments
    { regex: /\%\{[\s\S]*?\%\}/gm, css: 'comments'}, // multiline comments
    { regex: SyntaxHighlighter.regexLib.singleQuotedString, css: 'string' },
    { regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'string'},
    { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' },
    { regex: new RegExp(this.getKeywords(variable), 'gm'), css: 'variable' },
	{ regex: new RegExp(this.getKeywords(constants), 'gm'), css: 'constants' },
	{ regex: new RegExp(this.getKeywords(functions), 'gm'), css: 'functions bold' }

  ];
};
SyntaxHighlighter.brushes.MatlabKey.prototype   = new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.MatlabKey.aliases = ['matlab'];